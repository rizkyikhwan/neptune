import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text
} from '@react-email/components';
import * as React from 'react';

interface VerifyEmailProps {
  username: string;
  token: string | null
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const VerifyEmail = ({
  username,
  token
}: VerifyEmailProps) => {

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body style={main} className="bg-white my-auto mx-auto">
          <Container className="max-w-xl w-full my-7 mx-auto border border-solid border-[#eaeaea] rounded-md">
            <Section className="p-7">
              <Img width={120} src={`https://res.cloudinary.com/delfgoiya/image/upload/v1697170934/hhokprwe7vlmrdwhu2y9.png`} className="my-0 mx-auto" />
            </Section>
            <Section className="w-full flex">
              <Row>
                <Column style={sectionBorder} />
                <Column className="border border-solid border-b-[#141e30] w-[102px]" />
                <Column style={sectionBorder} />
              </Row>
            </Section>
            <Section className="pt-1 px-12 pb-2">
              <Text className="text-lg font-semibold">
                Verify your account
              </Text>
              <Text className="text-sm">
                Hi <b>{username}</b>, thanks you for signing up for NotShy. To verify your account, please follow the button below
              </Text>
              <Section className="my-8">
                <Link className="text-center bg-blue-500 rounded-lg text-sm no-underline font-semibold w-[200px] inline-block max-w-full py-4 px-5 text-white" href={`http://localhost:3000/verification/${token}`} target="__blank">
                  Verify Account
                </Link>
                <Text className='text-sm'>
                  Delete soon <br />
                  http://localhost:3000/verification/{token}
                </Text>
              </Section>
              <Text className="text-sm">
                Thanks,
                <br />
                NotShy Support
              </Text>
            </Section>
          </Container>
          <Section className="max-w-xl w-full mx-auto">
            <Text style={{ textAlign: 'center', color: '#706a7b' }}>
              © 2023 NotShy, All Rights Reserved
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