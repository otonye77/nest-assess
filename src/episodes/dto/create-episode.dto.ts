export class CreateCommentDto {
  comment: string;
  ipAddressLocation: string;
}

export class CreateEpisodeDto {
  name: string;
  releaseDate: Date;
  episodeCode: string;
  characterIds: number[];
  comments: CreateCommentDto[];
}
