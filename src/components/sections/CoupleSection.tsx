import { motion } from 'framer-motion';
import React from 'react';
import { useInvitationContext } from '../../context/InvitationContext';
import { CoupleMember } from '../../types/wedding';
import { PolaroidCard } from '../common/PolaroidCard';
import { SectionHeader } from '../common/SectionHeader';

const CoupleMemberCard: React.FC<{
  member: CoupleMember;
  familyLabel: string;
  rotationDeg: number;
}> = ({ member, familyLabel, rotationDeg }) => (
  <motion.article
    className="couple-card"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.65 }}
  >
    <div className="couple-card__polaroid">
      <PolaroidCard
        imageUrl={member.avatarUrl}
        caption={member.shortName}
        rotationDeg={rotationDeg}
        tapePosition="top-center"
        aspect={member.role === 'bride' ? 'square' : 'portrait'}
      />
    </div>
    <span className="couple-card__role">{member.title}</span>
    <h3 className="couple-card__name">{member.fullName}</h3>
    <p className="couple-card__order">{member.birthOrder}</p>
    <p className="couple-card__bio">{member.bio}</p>

    <div className="couple-card__parents">
      <strong>{familyLabel}</strong>
      <div>{member.parents.father}</div>
      <div>{member.parents.mother}</div>
      <div>{member.parents.address}</div>
    </div>
  </motion.article>
);

export const CoupleSection: React.FC = () => {
  const { config } = useInvitationContext();

  return (
    <section className="section-container" id="couple">
      <SectionHeader
        scriptTitle="Nhân vật chính"
        title="Cô Dâu & Chú Rể"
        subtitle="Hai gia đình trân trọng báo tin lễ thành hôn của hai con chúng tôi."
      />

      <div className="couple-grid">
        <CoupleMemberCard
          member={config.groom}
          familyLabel="Gia Đình Nhà Trai"
          rotationDeg={-2}
        />
        <CoupleMemberCard
          member={config.bride}
          familyLabel="Gia Đình Nhà Gái"
          rotationDeg={2}
        />
      </div>
    </section>
  );
};
