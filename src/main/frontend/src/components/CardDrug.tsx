import React from 'react';
import { Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Meta from 'antd/lib/card/Meta';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';

import { Drug } from '@/types/Drug';
import DynamicDrugIcon from './DynamicDrugIcon';



//props key and drug
interface CardDrugProps {
    key: number;
    showModel: (drug: Drug) => void;
    drug: Drug;
}

const CardDrug: React.FC<CardDrugProps> = ({ drug, showModel }) => {

    return (
        <Card title={drug.medicinale.denominazioneMedicinale}
        variant='borderless' 
            actions={[
                <div key={drug.medicinale.denominazioneMedicinale} className='w-full h-full' onClick={() => showModel(drug)}><FontAwesomeIcon icon={faTruckFast} /> Ordina</div>
            ]}>
            <Meta
                // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                avatar={
                // <FontAwesomeIcon icon={solidIcons[iconName] as IconDefinition || solidIcons.faExclamationTriangle} size="2x" />
                <DynamicDrugIcon drug={drug} />
            
            } //http://localhost:8080/api/v1/icon/type/${drug.formaFarmaceutica}
                title={drug.descrizioneFormaDosaggio}
                description= {<div><p><strong>Somministrazione: </strong>{drug.vieSomministrazione}</p><br/><p><strong>formaFarmaceutica: </strong>{drug.formaFarmaceutica}</p></div>}
            />

        </Card>
    )
}

export default CardDrug;