import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET(req: NextRequest) {
  try {
    const shopId = req.nextUrl.searchParams.get('shopId');
    if (!shopId) return NextResponse.json({ error: 'shopId required' }, { status: 400 });

    const supabase = createServiceClient();
    const { data: collaborators, error: collErr } = await supabase
      .from('collaborators')
      .select('user_id, status, joined_at, profiles(name, email, initials)')
      .eq('shop_id', shopId);

    if (collErr) throw collErr;

    const { data: invites, error: inviteErr } = await supabase
      .from('invites')
      .select('email, status, invited_by, created_at')
      .eq('shop_id', shopId);

    if (inviteErr) throw inviteErr;

    return NextResponse.json({ collaborators, invites });
  } catch (err: any) {
    console.error('GET /api/collaborators error', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shopId, emails, invitedBy } = body;
    if (!shopId || !emails || !Array.isArray(emails)) {
      return NextResponse.json({ error: 'shopId and emails[] required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Insert into invites; for each email try to link to a profile and add collaborator
    const inserts = emails.map((email: string) => ({ shop_id: shopId, email, invited_by: invitedBy || null }));
    const { error: invErr } = await supabase.from('invites').insert(inserts);
    if (invErr) console.warn('Invite insert warning', invErr.message);

    // Attempt to find profiles for these emails and create collaborator rows for existing users
    const { data: profiles } = await supabase.from('profiles').select('id,email').in('email', emails);
    if (profiles && profiles.length) {
      const collInserts = profiles.map((p: any) => ({ shop_id: shopId, user_id: p.id, status: 'pending' }));
      const { error: collErr } = await supabase.from('collaborators').insert(collInserts).select();
      if (collErr) console.warn('Collaborator insert warning', collErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('POST /api/collaborators error', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { shopId, email, userId } = body;
    if (!shopId || (!email && !userId)) {
      return NextResponse.json({ error: 'shopId and email or userId required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // remove collaborator by userId if provided
    if (userId) {
      await supabase.from('collaborators').delete().match({ shop_id: shopId, user_id: userId });
    }

    if (email) {
      // remove any invites and collaborator rows for this email
      await supabase.from('invites').delete().match({ shop_id: shopId, email });
      // try to find profile id
      const { data: profiles } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
      if (profiles && (profiles as any).id) {
        await supabase.from('collaborators').delete().match({ shop_id: shopId, user_id: (profiles as any).id });
      } else {
        // also attempt to delete any collaborators created with placeholder ids
        await supabase.from('collaborators').delete().like('user_id', `%${email}%`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('DELETE /api/collaborators error', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
