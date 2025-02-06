import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Meta from 'antd/lib/card/Meta';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';

import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import DynamicIconComponent from './DynamicDrugIcon';
import DynamicDrugIconComponent from './DynamicDrugIcon';



//props key and drug
interface CardDrugProps {
    key: number;
    showModel: (drug: Drug) => void;
    drug: Drug;
}

const CardDrug: React.FC<CardDrugProps> = ({ drug, showModel }) => {

    return (
        <Card title={drug.medicinale.denominazioneMedicinale} bordered={false}
            actions={[
                <div className='w-full h-full' onClick={() => showModel(drug)}><FontAwesomeIcon icon={faTruckFast} /> Ordina</div>
            ]}>
            <Meta
                // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                avatar={
                // <FontAwesomeIcon icon={solidIcons[iconName] as IconDefinition || solidIcons.faExclamationTriangle} size="2x" />
                <DynamicDrugIconComponent drug={drug} />
            
            } //http://localhost:8080/api/v1/icon/type/${drug.formaFarmaceutica}
                title={drug.descrizioneFormaDosaggio}
                description= {<p><strong>Somministrazione: </strong>{drug.vieSomministrazione}</p>}
            />

        </Card>
    )
}

export default CardDrug;