import { motion } from 'framer-motion';
import React from 'react';
import { useInvitationContext } from '../../context/InvitationContext';
import { PolaroidCard } from '../common/PolaroidCard';
import { SectionHeader } from '../common/SectionHeader';

export const StorySection: React.FC = () => {
  const { config } = useInvitationContext();

  return (
    <section className="section-tint" id="story">
      <div className="section-container">
        <SectionHeader
          scriptTitle="Chặng đường yêu"
          title="Câu Chuyện Tình Yêu"
          subtitle="Từng tấm ảnh Polaroid là một mảnh ghép ký ức đưa chúng mình đến ngày hôm nay."
        />

        <div className="story-list">
          {config.story.map((item, idx) => (
            <motion.article
              key={item.id}
              className={`story-item ${idx % 2 === 1 ? 'story-item--reverse' : ''}`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65 }}
            >
              <div className="story-item__media">
                <div className="story-item__polaroid">
                  <PolaroidCard
                    imageUrl={item.imageUrl}
                    caption={item.caption}
                    dateLabel={item.year}
                    rotationDeg={item.rotationDeg}
                    tapePosition="top-corners"
                    aspect="square"
                  />
                </div>
              </div>

              <div className="story-item__content">
                <span className="story-item__year">{item.year}</span>
                <h3 className="story-item__title">{item.title}</h3>
                <p className="story-item__desc">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
