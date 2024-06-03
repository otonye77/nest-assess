export class CreateCharacterDto {
  firstName: string;
  lastName: string;
  status: string;
  stateOfOrigin: string;
  gender: string;
  locationId: number;
  episodeIds: number[];
}
