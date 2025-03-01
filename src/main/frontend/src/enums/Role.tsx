import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStaffSnake } from '@fortawesome/free-solid-svg-icons';

export enum Role {
    Patient = "PATIENT",
    Doctor = "DOCTOR",
    Driver = "DRIVER",
}

export const RoleIcon: Record<Role, React.ReactNode> = {
    [Role.Patient]: <FontAwesomeIcon icon={faUser} />,
    [Role.Doctor]: <FontAwesomeIcon icon={faStaffSnake} />,
    [Role.Driver]: <FontAwesomeIcon icon={faStaffSnake} />,
};