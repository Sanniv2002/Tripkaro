import { InvitePageClient } from '@/components/invite/invite-page-client';

interface Props {
  params: {
    code: string;
  };
}

export default function InvitePage({ params }: Props) {
  return <InvitePageClient code={params.code} />;
}