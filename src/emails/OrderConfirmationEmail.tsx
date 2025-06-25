import { Html, Head, Preview, Body, Container, Heading, Text, Button } from "@react-email/components";

interface OrderConfirmationEmailProps {
  orderId: string;
  productName: string;
  url: string;
}

export default function OrderConfirmationEmail({ orderId, productName, url }: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Konfirmasi Pesanan #{orderId}</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container>
          <Heading>Terima kasih atas pesanan Anda!</Heading>
          <Text>Pesanan <strong>{productName}</strong> dengan ID {orderId} telah kami terima.</Text>
          <Button href={url}>Lihat Pesanan</Button>
        </Container>
      </Body>
    </Html>
  );
}
