
export enum Priority {
    NORMAL,
    HIGH
  }
  //cast to Priority
  export function castToPriority(value: string | undefined): Priority {
      const status = Priority[value as keyof typeof Priority];
      return status === undefined ? Priority.NORMAL : status;
  }
  
  //reverse cast to Priority
  export function castFromPriority(value: Priority): string {
      return Priority[value];
  }