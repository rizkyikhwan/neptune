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
import React from 'react';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const linkUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SITE_URL : "http://localhost:3000"

const VerifyCode = ({ code }: { code: string }) => {
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
              <Text className="text-sm">
                Before we change the email on your account, we just need to confirm that this is you. Below is the verification code for your Neptune account.
              </Text>
              <Section className="my-8">
                <Section className="mx-auto my-2 align-middle rounded w-72 bg-slate-100">
                  <Text className="inline-block w-full mx-auto font-mono text-3xl font-bold leading-10 tracking-widest text-center text-black">{code.toUpperCase()}</Text>
                </Section>
              </Section>
              <Text className="text-sm">
                Don't share this code with anyone. <br />
                If you didn't ask for this code, please ignore this email.
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

export default VerifyCode;

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif';

const main = {
  backgroundColor: '#efeef1',
  fontFamily,
};

const sectionBorder = {
  borderBottom: '1px solid rgb(238,238,238)',
  width: '249px',
};