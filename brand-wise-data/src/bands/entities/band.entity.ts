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

export class FlattenedData {
   /**
   * The record level of the band
   * @example Pacific Records
   */
  label?: string;

   /**
   * Obejct with band name and festival
   * @example {name: "Band Name", festival: {name: "festival name"}}
   */
  band?: {
    name?:string;
    festival?:{
      name?:string;
    }
  }
}

export class FestivalName {
  @ApiProperty({ example: "Omega Festival", description: 'Festival Name' })
  name?: string;
}

export class BandFestival {
  @ApiProperty({ example: "Band X", description: 'Label of the band' })
  name?: string;

  @ApiProperty({ example: [{
        "name": "Omega Festival"
    }], description: 'Information of the band' })
    festival?: FestivalName;
}

export class BandFestivals {
  @ApiProperty({ example: "Band X", description: 'Label of the band' })
  name?: string;

  @ApiProperty({ example: [{
        "name": "Omega Festival"
    }], description: 'Information of the band' })
    festivals?: FestivalName[];
}

export class RecordFestival {
  @ApiProperty({ example: "Record Label 1", description: 'Label of the record' })
 label?: string;

 @ApiProperty({ example: [{
     "name": "Band X",
     "festival": {
         "name": "Omega Festival"
     }
   }], description: 'Information of the band with band name and the one festival' })
 bands?: BandFestival[];
}

export class Record {
   @ApiProperty({ example: "Record Label 1", description: 'Label of the record' })
  label?: string;

  @ApiProperty({ example: [{
      "name": "Band X",
      "festivals": [{
          "name": "Omega Festival"
      }]
    }], description: 'Information of the band with band name and the festivals' })
  bands?: BandFestivals[];
}
