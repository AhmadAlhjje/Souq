import React from 'react';
import Typography from '../atoms/Typography';
import SearchBar from '../molecules/SearchBar';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
  searchProps: SearchBarProps;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  searchProps 
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md border-b-2 border-[#96EDD9]/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <Typography variant="h1" className="mb-6">{title}</Typography>
          <Typography variant="body" className="text-xl max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </Typography>
        </div>
        <SearchBar {...searchProps} />
      </div>
    </div>
  );
};

export default PageHeader;