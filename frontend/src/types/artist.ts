export enum SpecialID {
  ANY  = "_any",
}

export default interface Artist {
  id: number | SpecialID;
  name: string;
  isSpecial: boolean;
}
