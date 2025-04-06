import React, { useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { ENV } from '../../env';

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
  onExpire?: () => void;
}

const ReCaptchaComponent: React.FC<ReCaptchaProps> = ({ onVerify, onExpire }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    // Reset reCAPTCHA when component mounts
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, []);

  const handleExpire = () => {
    onVerify(null);
    if (onExpire) {
      onExpire();
    }
  };

  return (
    <div className="flex justify-center my-4 w-full">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={ENV.RECAPTCHA_SITE_KEY}
        onChange={onVerify}
        onExpired={handleExpire}
        hl="ar" // Arabic language
      />
    </div>
  );
};

export default ReCaptchaComponent;