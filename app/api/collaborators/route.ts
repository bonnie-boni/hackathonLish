import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { Collaborator } from '@/lib/mongodb/models/Collaborator';
import { Invite } from '@/lib/mongodb/models/Invite';
import { Profile } from '@/lib/mongodb/models/Profile';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const shopId = req.nextUrl.searchParams.get('shopId');
    if (!shopId) return NextResponse.json({ error: 'shopId required' }, { status: 400 });

    const collaborators = await Collaborator.find({ shopId }).lean();
    const enriched = await Promise.all(
      collaborators.map(async (c: any) => {
        const profile = await Profile.findById(c.userId).lean().catch(() => null);
        return {
          user_id: c.userId,
          status: c.status,
          joined_at: c.joinedAt,
          profiles: profile
            ? { id: (profile._id as any).toString(), name: (profile as any).name, email: (profile as any).email, initials: (profile as any).initials }
            : null,
        };
      })
    );

    const invites = await Invite.find({ shopId }).lean();
    const mappedInvites = invites.map((i: any) => ({
      email: i.email,
      status: i.status,
      invited_by: i.invitedBy,
      created_at: i.createdAt,
    }));

    return NextResponse.json({ collaborators: enriched, invites: mappedInvites });
  } catch (err: any) {
    console.error('GET /api/collaborators error', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { shopId, emails, invitedBy } = body;
    if (!shopId || !emails || !Array.isArray(emails)) {
      return NextResponse.json({ error: 'shopId and emails[] required' }, { status: 400 });
    }

    const inviteDocs = emails.map((email: string) => ({
      shopId,
      email,
      invitedBy: invitedBy || null,
    }));
    await Invite.insertMany(inviteDocs).catch((err: any) => console.warn('Invite insert warning', err.message));

    const profiles = await Profile.find({ email: { $in: emails } }).lean();
    if (profiles.length > 0) {
      const collInserts = profiles.map((p: any) => ({
        shopId,
        userId: p._id.toString(),
        status: 'pending',
      }));
      await Collaborator.insertMany(collInserts).catch((err: any) => console.warn('Collaborator insert warning', err.message));
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('POST /api/collaborators error', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { shopId, email, userId } = body;
    if (!shopId || (!email && !userId)) {
      return NextResponse.json({ error: 'shopId and email or userId required' }, { status: 400 });
    }

    if (userId) {
      await Collaborator.deleteMany({ shopId, userId });
    }

    if (email) {
      await Invite.deleteMany({ shopId, email });
      const profile = await Profile.findOne({ email }).lean();
      if (profile) {
        await Collaborator.deleteMany({ shopId, userId: (profile._id as any).toString() });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('DELETE /api/collaborators error', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
