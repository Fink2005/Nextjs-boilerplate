import RootTemplate from '@/templates/RootTemplate';
import { setRequestLocale } from 'next-intl/server';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <>
      <RootTemplate>
        {props.children}
      </RootTemplate>
    </>
  );
}
