import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStaffSnake } from '@fortawesome/free-solid-svg-icons';

export enum AuthEntityType {
    User = "user",
    Pharmacy = "pharmacy",
}

export const AuthEntityTypeIcon: Record<AuthEntityType, React.ReactNode> = {
    [AuthEntityType.User]: <FontAwesomeIcon icon={faUser} />,
    [AuthEntityType.Pharmacy]: <FontAwesomeIcon icon={faStaffSnake} />,
};