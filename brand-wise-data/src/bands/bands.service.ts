import { Injectable } from '@nestjs/common';
import { Festival, Record } from './entities/band.entity';

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
  * Purpose: This function transforms the data as required.
  * Parameters are as follows.
  * festivals: is the data received from the downstream and to be tranformed.
  * Return: the transformed object array
  */
  getTransformeddData(festivals:Festival[]): Record[] {
    let transformedData: Record[] = [];
    let topLabels = [];
    festivals && festivals.forEach(data=>{
      let bandsArray = [];
      let bands = data.bands;
      bands.forEach(band=>{
        let indexOfTopLabel = topLabels.indexOf(String(band.recordLabel));
        if(indexOfTopLabel === -1) {
          topLabels.push(String(band.recordLabel));
          transformedData.push({
            label: String(band.recordLabel),
            bands:[{
              name: String(band.name),
              festivals: [{name:String(data.name)}]
            }]
          });
        } else {
          let indexOfBandsArray = bandsArray.indexOf(String(band.name));
          if(indexOfBandsArray === -1) {
            bandsArray.push(String(band.name));
            transformedData[indexOfTopLabel].bands.push({
              name: String(band.name),
              festivals: [{name:String(data.name)}]
            });
            transformedData[indexOfTopLabel].bands = this.sort(transformedData[indexOfTopLabel].bands, "name", 1);
          } else {
            transformedData[indexOfTopLabel].bands[indexOfBandsArray].festivals.push({name:String(data.name)});
            transformedData[indexOfTopLabel].bands[indexOfBandsArray].festivals = this.sort(transformedData[indexOfTopLabel].bands[indexOfBandsArray].festivals, "name", 1);
          }          
        }        
      });
    });
    return transformedData;
  }
}
