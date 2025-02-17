import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";

interface DynamicDrugIconProps {
  drug: {
    formaFarmaceutica: string;
  };
}

const DynamicDrugIcon: React.FC<DynamicDrugIconProps> = ({ drug }) => {
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

  useEffect(() => {

    const fetchIcon = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/icon?type=${drug.formaFarmaceutica}`);
        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
          const data = await response.json();
          console.log('Icon data:', data);
          if (data) setIconData(data);
        }
      } catch (error) {
        console.error('Errore nel recupero dell\'icona:', error);
      }
    };

    fetchIcon();
  }, [drug.formaFarmaceutica]);

  const colorClass = colorMap[iconData?.color as keyof typeof colorMap] || colorMap["gray"];

  return (
    <div>
      {iconData ? (
        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${colorClass}`}>
          <FontAwesomeIcon icon={solidIcons[iconData.name] as IconDefinition || solidIcons.faExclamationTriangle} className={` text-2xl`} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DynamicDrugIcon;
