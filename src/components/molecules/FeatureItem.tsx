import React from "react";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";

const FeatureItem = ({ icon, title, description }) => {
  return (
    <div className="flex items-start space-x-4 space-x-reverse group">
      <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="flex-1">
        <Heading level={4} className="leading-tight mb-1">
          {title}
        </Heading>
        {description && (
          <Text size="sm" color="muted">
            {description}
          </Text>
        )}
      </div>
    </div>
  );
};

export default FeatureItem;