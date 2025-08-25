import React from "react";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import FeatureItem from "../molecules/FeatureItem";
import SolutionImageCard from "./SolutionImageCard";

const SolutionCard = ({ solution, index }) => {
  return (
    <div className="relative">
      <div className={`absolute inset-0 ${
        index === 0
          ? "bg-gradient-to-l from-[#96EDD9]/20 to-transparent"
          : index === 1
          ? "bg-gradient-to-br from-[#96EDD9]/15 via-white/40 to-[#96EDD9]/25"
          : "bg-[#96EDD9]/30"
      } rounded-3xl blur-3xl`}></div>

      <div className="relative backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 p-6 lg:p-10 items-center">
          
          {/* Content Side */}
          <div className={`${solution.reverse ? "lg:order-2" : ""} space-y-6`}>
            <div>
              <Heading level={3} className="mb-3">{solution.title}</Heading>
              <Text color="secondary" className="leading-relaxed text-sm">
                {solution.description}
              </Text>
            </div>
            
            <div className="space-y-4">
              {solution.features.map((feature, featureIndex) => (
                <FeatureItem
                  key={featureIndex}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
            
            <div className="pt-3">
              <Button 
                variant="primary" 
                size="sm"
                icon={solution.buttonIcon}
              >
                {solution.buttonText}
              </Button>
            </div>
          </div>
          
          {/* Image Side */}
          <SolutionImageCard solution={solution} />
        </div>
      </div>
    </div>
  );
};

export default SolutionCard;