import React from "react";
import { FaRocket } from "react-icons/fa";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import IconWrapper from "./IconWrapper";

const CTACard = ({ title, description, buttonText, buttonIcon, onClick }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center">
      <IconWrapper 
        icon={<Icon icon={FaRocket} size="2xl" color="white" />} 
        size="xl"
        gradient="from-[#004D5A] to-[#005965]"
      />
      <Heading level={3} className="text-white mt-6 mb-3">
        {title}
      </Heading>
      <Text color="white" className="mb-6 max-w-2xl leading-relaxed">
        {description}
      </Text>
      <Button 
        variant="secondary" 
        size="lg" 
        icon={buttonIcon}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default CTACard;