import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStaffSnake, faTruckFast } from '@fortawesome/free-solid-svg-icons';

export enum Role {
    Patient = "PATIENT",
    Doctor = "DOCTOR",
    Driver = "DRIVER",
}

//eum to get the role name
export const RoleName: Record<Role, string> = {
    [Role.Patient]: "Paziente",
    [Role.Doctor]: "Medico",
    [Role.Driver]: "Driver",
};

export const RoleIcon: Record<Role, React.ReactNode> = {
    [Role.Patient]: <FontAwesomeIcon icon={faUser} />,
    [Role.Doctor]: <FontAwesomeIcon icon={faStaffSnake} />,
    [Role.Driver]: <FontAwesomeIcon icon={faTruckFast} />,
};