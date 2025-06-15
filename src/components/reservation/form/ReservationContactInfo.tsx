
import PersonalInfoSection from './PersonalInfoSection';
import AddressSection from './AddressSection';

interface ReservationContactInfoProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  street: string;
  setStreet: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
  emailError?: string | null;
  validateEmail?: (email: string) => boolean;
}

const ReservationContactInfo = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  street,
  setStreet,
  city,
  setCity,
  postalCode,
  setPostalCode,
  emailError,
  validateEmail
}: ReservationContactInfoProps) => {
  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <PersonalInfoSection
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        emailError={emailError}
        validateEmail={validateEmail}
      />

      {/* Address Section */}
      <AddressSection
        street={street}
        setStreet={setStreet}
        city={city}
        setCity={setCity}
        postalCode={postalCode}
        setPostalCode={setPostalCode}
      />
    </div>
  );
};

export default ReservationContactInfo;
