import { Injectable } from '@nestjs/common';
import { Festival, Record, FlattenedData, RecordFestival } from './entities/band.entity';

@Injectable()
export class BandsService {  

  /*
  * Purpose: fetching the downstream datafrom the provided swagger.
  * There is no functional argument.
  * Return: the down stream data array.
  */
  async fetchDownStreamData():Promise<Festival[]> {
    try{
      return await(await fetch('https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals')).json();
    } catch(e) {
      console.info(`Caught Error: There was an issue in fetching the data from server.\n
      Respose from the server: ${e}`);
    }    
  }

  /*
  * Purpose: Return the re-shaped data.
  * There is no functional argument.
  * Return: the re-shaped and sorted data.
  */
  async getBands(): Promise<Record[]> {
    const downstreamResponse:Festival[] = await this.fetchDownStreamData();
    return this.sort(this.getTransformeddData(downstreamResponse), "label", 1);
  }

  /*
  * Purpose: This function transforms the data as required.
  * Parameters are as follows.
  * festivals: is the data received from the downstream and to be tranformed.
  * Return: the transformed object array
  */
  getTransformeddData(festivals:Festival[]):Record[] {
    let flattenedData = this.flatten(festivals);
    let bandsCollectedData = this.collectBandData(flattenedData);
    let transformedData:Record[] = this.collectFestivalData(bandsCollectedData);
    return transformedData;
  }

  /*
  * Purpose: This is the function for sorting. data and return values are kept as any[] 
  * so that any type of object can be sorted.
  * Parameters are as follows.
  * data: is the data to be sorted
  * sortingKey: This is the key by which the object arry will be sorted. The Key must be at top level.
  * order: 1 for increasing, -1 for decreasing
  */
  sort(data:any[], sortingKey:string, order:number=1):any[] {
    return data.sort((a, b) => {
      const LabelA = a[sortingKey];
      const LabelB = b[sortingKey];
      if (LabelA < LabelB) {
        return (order==1)?-1:1;
      }
      if (LabelA > LabelB) {
        return (order==1)?1:-1;
      }
      return 0;
    });
  }

  /*
  * Purpose: The original data is first flattened for further processing.
  * Parameters are as follows.
  * festivals: is the data received from the downstream and to be tranformed.
  * Return: the flattened object array
  */
  flatten(festivals:Festival[]): FlattenedData[] {
    let flattenedData: FlattenedData[] = [];
    festivals && festivals.forEach(data=>{
      let bands = data.bands;
      bands.forEach(band=>{
        flattenedData.push({
          label: String(band.recordLabel),
          band:{
            name: band.name,
            festival: {name:data.name}
          }
        });
      });
    });
    return flattenedData;
  }
  
  /*
  * Purpose: arrange the bands under unique lables (top labels).
  * Parameters are as follows.
  * flattenedData: is the flattened data as the output of the flatten() function.
  * Return: Returns the semi-transformed record, where the bands are collected under the top level.
  * However, the festivals yet needs to be collected.
  */
  collectBandData(flattenedData: FlattenedData[]): RecordFestival[] {
    let label = [];
    let bandsCollectedData:RecordFestival[] = [];
    flattenedData.forEach(data=>{
      let indexofLabel = label.indexOf(data.label);
      if(indexofLabel == -1) {
        bandsCollectedData.push({
          label: data.label,
          bands: [data.band]
        });
        label.push(data.label)
      } else {
        bandsCollectedData[indexofLabel].bands.push(data.band);        
      }
    });
    return bandsCollectedData;
  }
    
  /*
  * Purpose: Final transformed data.
  * Parameters are as follows.
  * bandsCollectedData: is the data collected from the output of the collectBandData() function.
  * Return: Returns the fully transformed data.
  */
  collectFestivalData(bandsCollectedData: RecordFestival[]): Record[] {
    let transformedData: Record[] = [];
    bandsCollectedData.forEach(data=>{
      let bandname = [];
      let bands = [];
      data.bands.forEach(b=>{
        let indexofBand = bandname.indexOf(b.name);
        if(indexofBand == -1) {
          bandname.push(b.name);
          bands.push({
            name: b.name,
            festivals: [b.festival]
          });
        } else {
          bands[indexofBand].festivals.push(b.festival);
          bands[indexofBand].festivals = this.sort(bands[indexofBand].festivals, "name", 1)
        }
      });
  
      transformedData.push({
        label:data.label,
        bands:this.sort(bands, "name", 1)
      });
    });
    return transformedData;
  }
}
