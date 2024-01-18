import { Test, TestingModule } from '@nestjs/testing';
import { BandsController } from './bands.controller';
import { BandsService } from './bands.service';
import { BandFestivals, FestivalName, Record } from './entities/band.entity';
import festivals from './mockdownstreamresponse';

const mockfetchDownStreamData = jest
    .spyOn(BandsService.prototype, 'fetchDownStreamData')
    .mockImplementation(async () => {
      return await festivals
    });

describe('Testing the data reshape', () => {
  let bandsController: BandsController;
  let bandsService: BandsService;
  let reshapedData:Record[];
  let one_element:Record;
  let label:string;
  let bands:BandFestivals[];
  let bandName:string;
  let bandFestivals: FestivalName[];
  let bandFirstFestival: FestivalName;
  let bandFirstFestivalName:string;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BandsController],
      providers: [BandsService],
    }).compile();

    bandsController = app.get<BandsController>(BandsController);
    bandsService = app.get<BandsService>(BandsService);
    reshapedData = await bandsController.getBands();
    one_element = await reshapedData[0];
    label = await one_element?.label;
    bands = await one_element?.bands;
    bandName = await bands[0].name;
    bandFestivals = await bands[0].festivals;
    if(bandFestivals.length>0) {
      bandFirstFestival = await bandFestivals[0];
      bandFirstFestivalName = bandFirstFestival && await bandFirstFestival.name;
    }
    
  });

  it('Mock service function fetchDownStreamData should be called', async () => {
    expect(mockfetchDownStreamData).toHaveBeenCalledTimes(1);
  });

  it('Should return an array of the reshaped data', async () => {
    expect(await reshapedData).toBeInstanceOf(Array);
  });

  it('Returned array should not be empty', async () => {
    let dataSize = await reshapedData.length;
    expect(await dataSize).toBeGreaterThan(0);
  });

  it('First label value should not be null', async () => {    
    expect(await label).not.toBeNull();
  });

  it('"label" for the first element of the reshaped array is an empty string', async () => {    
    expect(await label).toBe("");
  });  

  it('"label" for the first element of the reshaped array has only one bands', async () => {    
    expect(await bands.length).toBe(1);
  });  

  it('"band name" for the first element of the bands of first element of the reshaped array is "Winter Primates"', async () => {    
    expect(await bandName).toBe("Winter Primates");
  });

  it('"label" for the first element of the reshaped array has only 1 "bands" element', async () => {    
    expect(await bands.length).toBe(1);
  });  

  it(`"festivals" array of the first band of the first label has only 1 element`, async ()=>{
    expect(await bandFestivals.length).toBe(1);
  });

  it(`Should sort the object`, ()=>{
    const mockObj = [{
      label:"Hot Star",
      bands: [{
          name: "Yeshua Ministries",
          festivals: [{
            name: "Vishwakarma Pooja"
          }]
      }
      ]
    },{
      label:"Rock Star",
      bands: [{
          name: "Jolly Abraham",
          festivals: [{
            name: "Kumbh Mela"
          }]
      }
      ]
    },{
      label:"Block Star",
      bands: [{
          name: "Sheldon Bangera",
          festivals: [{
            name: "Pongal"
          }]
      }
      ]
    }];

    const expectedSortedObj = [{
      label:"Block Star",
      bands: [{
          name: "Sheldon Bangera",
          festivals: [{
            name: "Pongal"
          }]
      }
      ]
    },{
      label:"Hot Star",
      bands: [{
          name: "Yeshua Ministries",
          festivals: [{
            name: "Vishwakarma Pooja"
          }]
      }
      ]
    },{
      label:"Rock Star",
      bands: [{
          name: "Jolly Abraham",
          festivals: [{
            name: "Kumbh Mela"
          }]
      }
      ]
    }];

    let sortedMockObj = bandsService?.sort(mockObj, "label", 1);
    expect(sortedMockObj).toStrictEqual(expectedSortedObj);
  })
});
