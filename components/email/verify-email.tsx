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
import { EmailEnum } from '@/lib/type';

interface VerifyEmailProps {
  username: string;
  token: string | null
  type: string
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const linkUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SITE_URL : "http://localhost:3000"

const VerifyEmail = ({
  username,
  token,
  type
}: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body style={main} className="mx-auto my-auto bg-white">
          <Container className="max-w-xl w-full my-7 mx-auto border border-solid border-[#eaeaea] rounded-md">
            <Section className="p-7">
              <Img width={60} src={process.env.NODE_ENV === "production" ? NeptuneLogo.src : "https://res.cloudinary.com/delfgoiya/image/upload/v1697474947/logo_lygg2s.png"} className="mx-auto my-0" />
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
                Verify your {type === EmailEnum.VerifyEmail ? "account" : type === EmailEnum.NewEmail && "email"}
              </Text>
              <Text className="text-sm">
                {type === EmailEnum.VerifyEmail && `Hi <b>${username}</b>, thanks you for signing up for Neptune. To verify your account, please follow the button below`}
                {type === EmailEnum.NewEmail && "To verify your new email, please follow the button below"}
              </Text>
              <Section className="my-8">
                <Link className="text-center bg-blue-500 rounded-lg text-sm no-underline font-semibold w-[200px] inline-block max-w-full py-4 px-5 text-white" href={`${linkUrl}/verification/${token}`} target="_blank">
                  {type === EmailEnum.VerifyEmail && "Verify Account"}
                  {type === EmailEnum.NewEmail && "Verify New Email"}
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

export default VerifyEmail;

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif';

const main = {
  backgroundColor: '#efeef1',
  fontFamily,
};

const sectionBorder = {
  borderBottom: '1px solid rgb(238,238,238)',
  width: '249px',
};