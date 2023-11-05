import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Row,
  Section,
  Tailwind,
  Text
} from '@react-email/components';
import NeptuneLogo from "@/public/logo/logo.png"

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const linkUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SITE_URL : "http://localhost:3000"

export const ResetPasswordEmail = ({ token }: { token: string | null }) => {

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body style={main} className="mx-auto my-auto bg-white">
          <Container className="max-w-xl w-full my-7 mx-auto border border-solid border-[#eaeaea] rounded-md">
            <Section className="p-7">
              <Img width={80} src={process.env.NODE_ENV === "production" ? NeptuneLogo.src : "https://res.cloudinary.com/delfgoiya/image/upload/v1697474947/logo_lygg2s.png"} className="mx-auto my-0" />
            </Section>
            <Section className="flex w-full">
              <Row>
                <Column style={sectionBorder} />
                <Column className="border border-solid border-b-[#141e30] w-[102px]" />
                <Column style={sectionBorder} />
              </Row>
            </Section>
            <Section className="px-12 pt-1 pb-2">
              <Text className="text-lg font-semibold">
                Reset your password
              </Text>
              <Text className="text-sm">
                Follow the button to reset the password for your user.
              </Text>
              <Section className="my-8">
                <Link className="text-center bg-blue-500 rounded-lg text-sm no-underline font-semibold w-[200px] inline-block max-w-full py-4 px-5 text-white" href={`${linkUrl}/reset-password/${token}`} target="_blank">
                  Reset Password
                </Link>
              </Section>
              <Text className="text-sm">
                Thanks,
                <br />
                Neptune Support
              </Text>
            </Section>
          </Container>
          <Section className="w-full max-w-xl mx-auto">
            <Text style={{ textAlign: 'center', color: '#706a7b' }}>
              © 2023 Neptune, All Rights Reserved
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif';

const main = {
  backgroundColor: '#efeef1',
  fontFamily,
};

const sectionBorder = {
  borderBottom: '1px solid rgb(238,238,238)',
  width: '249px',
};