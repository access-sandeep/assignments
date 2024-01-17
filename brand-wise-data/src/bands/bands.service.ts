import { Injectable } from '@nestjs/common';
import { Festival, FestivalName, BandFestivals, Record } from './entities/band.entity';

@Injectable()
export class BandsService {  
  async getBands(): Promise<Record[]> {
    const  downstreamResponse:Festival[] = await(await fetch('https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals')).json();
    return this.transform(downstreamResponse);
  }

  transform(downstreamResponse:Festival[]): Record[] {
      let transformed_data: Record[] = [];
      const records = new Map([...this.buildMap(downstreamResponse)].sort());
      records.forEach((value, key, map) => {
          let bands = [];
          for (let i in value) {
              bands.push(...value[i]);
          }
          transformed_data.push({
              'label': key,
              'bands': bands
          });
      });
      return transformed_data;
  }

  buildMap(downstreamResponse:Festival[]):Map<string, BandFestivals> {
      const records = new Map();
      for (let festive_index in downstreamResponse) {
          const entry = downstreamResponse[festive_index];
          const festivalname: string = entry.name;
          const bands = new Map();
          let festinames:string[]  = [];
          for (let band_index in entry.bands) {
              const festive_bands = entry.bands[band_index];
              festinames.push(festivalname);
              festinames.sort();
              bands.set(festive_bands.name, {
                  "name": festive_bands.name,
                  "festivals": this.toNameKeyObject(festinames)
              });
              let sorted_bands = new Map([...bands].sort());
              records.set(String(festive_bands.recordLabel), {
                  "bands": sorted_bands.values()
              })
          }
      }
      return records;
  }

  toNameKeyObject(festinames:string[]): FestivalName[] {
    return festinames.map(festivalname=>{
        return {"name":  festivalname};
    });
  }
}
