import Input from '../../components/atoms/Input';
import Label from '../../components/atoms/Label';
import CountrySelect from '../../components/atoms/CountrySelect';

const PhoneField = ({ label, countryCode, setCountryCode, phoneNumber, setPhoneNumber }) => {
  return (
    <div className="mb-3 sm:mb-4">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="tel"
          placeholder="أدخل رقم الجوال"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="flex-1"
        />
        <CountrySelect value={countryCode} onChange={(e) => setCountryCode(e.target.value)} />
      </div>
    </div>
  );
};

export default PhoneField;