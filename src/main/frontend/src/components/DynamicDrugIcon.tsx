import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";

import api from "@/utils/api";

interface DynamicDrugIconProps {
  drug: {
    formaFarmaceutica: string;
  };
  size?: "small" | "medium" | "large";
}

const DynamicDrugIcon: React.FC<DynamicDrugIconProps> = ({ drug, size = "small" }) => {
  const [iconData, setIconData] = useState<{ name: keyof typeof solidIcons; color: string } | null>({ name: "faKitMedical", color: "gray" });

  const colorMap = {
    "red": "text-red bg-red/20",
    "green": "text-green bg-green/20",
    "blue": "text-blue bg-blue/20",
    "yellow": "text-yellow bg-yellow/20",
    "purple": "text-purple bg-purple/20",
    "pink": "text-pink bg-pink/20",
    "indigo": "text-indigo bg-indigo/20",
    "teal": "text-teal bg-teal/20",
    "orange": "text-orange bg-orange/20",
    "cyan": "text-cyan bg-cyan/20",
    "gray": "text-gray-200 bg-gray-200/20",
    "lime": "text-lime bg-lime/20",
    "amber": "text-amber bg-amber/20",
    "emerald": "text-emerald bg-emerald/20",
    "lightBlue": "text-lightBlue bg-lightBlue/20",
    "violet": "text-violet bg-violet/20",
    "fuchsia": "text-fuchsia bg-fuchsia/20",
    "rose": "text-rose bg-rose/20",
  };

  const sizeMap = {
    "small": "w-12 h-12",
    "medium": "w-24 h-24",
    "large": "w-40 h-40",
  };

  const sizeIconMap = {
    "small": "text-2xl",
    "medium": "text-3xl",
    "large": "text-6xl",
  };

  useEffect(() => {

    const fetchIcon = async () => {
      try {
        const response = await api.get(`icon?type=${drug.formaFarmaceutica}`);
        if (response.status === 200 && response.headers["content-type"]?.includes('application/json')) {
          const data = response.data;
          if (data.name && data.color) {
            setIconData(data);
          } else {
            setIconData({ name: "faKitMedical", color: "gray" });
          }
        } else {
          setIconData({ name: "faKitMedical", color: "gray" });
        }
      } catch (error) {
        console.error('Errore nel recupero dell\'icona:', error);
        setIconData({ name: "faKitMedical", color: "gray" });
      }
    };

    fetchIcon();
  }, [drug.formaFarmaceutica]);



  const colorClass = colorMap[iconData?.color as keyof typeof colorMap] || colorMap["gray"];
  const sizeClass = sizeMap[size as keyof typeof sizeMap] || sizeMap["small"];
  const sizeIconClass = sizeIconMap[size as keyof typeof sizeIconMap] || sizeIconMap["small"];

  return (
    <div>
      {iconData ? (
        <div className={`${sizeClass} flex items-center justify-center rounded-full ${colorClass}`}>
          <FontAwesomeIcon icon={solidIcons[iconData.name] as IconDefinition || solidIcons.faExclamationTriangle} className={sizeIconClass} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DynamicDrugIcon;
