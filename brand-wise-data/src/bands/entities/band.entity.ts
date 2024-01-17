import { ApiProperty } from '@nestjs/swagger';

export class Festival {
  /**
   * The name of the band
   * @example LOL-palooza
   */
  name?: string;
  
  /**
   * The brand data
   * @example [{
        "name": "Frank Jupiter",
        "recordLabel": "Pacific Records"
      }]
   */
  bands?: Band[];
}

export class Band {
  /**
   * The name of the band
   * @example Squint-281
   */
  name?: string;

  /**
   * The record level of the band
   * @example Pacific Records
   */
  recordLabel?: string;
}

// Need to transform
export class Record2 {
   @ApiProperty({ example: "LOL-palooza", description: 'Label of the record' })
  name?: string;

  @ApiProperty({ example: [{
      "name": "Frank Jupiter",
      "recordLabel": "Pacific Records"
    }], description: 'Information of the band' })
  bands?: Band[];
}

export class FestivalName {
  @ApiProperty({ example: "Omega Festival", description: 'Festival Name' })
  name?: string;
}

export class BandFestivals {
  @ApiProperty({ example: "Band X", description: 'Label of the band' })
  name?: string;

  @ApiProperty({ example: [{
        "name": "Omega Festival"
    }], description: 'Information of the band' })
    festivals?: FestivalName[];
}

// Need to transform
export class Record {
   @ApiProperty({ example: "Record Label 1", description: 'Label of the record' })
  label?: string;

  @ApiProperty({ example: [{
      "name": "Band X",
      "festivals": `[{
          "name": "Omega Festival"
      }]`
    }], description: 'Information of the band' })
  bands?: BandFestivals[];
}
