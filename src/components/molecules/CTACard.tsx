import React from "react"; 
import { FaRocket } from "react-icons/fa"; 
import Heading from "../atoms/Heading"; 
import Text from "../atoms/Text"; 
import Button from "../atoms/Button"; 
import IconWrapper from "./IconWrapper";

interface CTACardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon: React.ReactNode;
  onClick: () => void;
}

const CTACard: React.FC<CTACardProps> = ({ 
  title, 
  description, 
  buttonText, 
  buttonIcon, 
  onClick 
}) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center">
      <IconWrapper         
        icon={<FaRocket className="w-6 h-6 text-white" />}         
        size="lg"        
        gradient="from-[#004D5A] to-[#005965]"
      />
      <Heading 
        text={title}
        level={3} 
        variant="hero"
        className="mt-6 mb-3"
      />
      <Text 
        text={description}
        variant="hero"
        className="mb-6 max-w-2xl leading-relaxed"
      />
      <Button         
        text={buttonText}
        variant="secondary"         
        size="lg"         
        startIcon={buttonIcon}        
        onClick={onClick}
      />
    </div>
  );
};

export default CTACard;