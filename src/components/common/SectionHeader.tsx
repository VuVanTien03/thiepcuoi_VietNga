import React from 'react';
import { BotanicalSprig } from './BotanicalDecoration';

interface SectionHeaderProps {
  scriptTitle: string;
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  scriptTitle,
  title,
  subtitle,
}) => {
  return (
    <header className="section-header">
      <p className="section-header__script">{scriptTitle}</p>
      <h2 className="section-header__title">{title}</h2>
      <div className="section-divider" aria-hidden="true">
        <span className="section-divider__line" />
        <BotanicalSprig />
        <span className="section-divider__line" />
      </div>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </header>
  );
};
