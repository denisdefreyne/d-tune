export enum SpecialID {
  ANY  = "_any",
  NONE = "_none",
}

export default interface Label {
  id: number | SpecialID;
  name: string;
  isSpecial: boolean;
}
