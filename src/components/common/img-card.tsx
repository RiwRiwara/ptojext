import styles from "@/styles/card.module.css"
import { BiImageAlt } from 'react-icons/bi';

const Card = () => {
  return (
    <div
      className={`${styles.card} `}
      onMouseEnter={(e) => e.currentTarget.classList.add(styles.cardHover)}
      onMouseLeave={(e) => e.currentTarget.classList.remove(styles.cardHover)}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-14 h-14 rounded-full bg-white shadow-md flex justify-center items-center">
            <BiImageAlt className="w-10 h-10 text-red-500" />
          </div>
          <span className="text-xl text-gray-800 font-semibold">
            Image Processing
          </span>
        </div>
      </div>
      <div className="w-full text-wrap text-gray-700 text-lg">
        Simulation for image processing, such as pre-processing filtering.
      </div>

      <div
        className={`${styles.hiddenContent} ${styles.visibleContent} `}
      >
        {[...Array(7)].map((_, index) => (
          <div key={index} className={styles.shadowBox}></div>
        ))}
      </div>
    </div>
  );
};

export default Card;
