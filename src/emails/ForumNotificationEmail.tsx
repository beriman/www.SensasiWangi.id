import { Html, Head, Preview, Body, Container, Heading, Text, Button } from "@react-email/components";

interface ForumNotificationEmailProps {
  topic: string;
  message: string;
  url: string;
}

export default function ForumNotificationEmail({ topic, message, url }: ForumNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Aktivitas Baru di Forum</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container>
          <Heading>Notifikasi Forum</Heading>
          <Text>{message} pada topik <strong>{topic}</strong>.</Text>
          <Button href={url}>Lihat Diskusi</Button>
        </Container>
      </Body>
    </Html>
  );
}
