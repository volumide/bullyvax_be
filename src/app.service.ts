import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  SCHOOLS_REPOSITORY,
  SPONSORSHIPS_REPOSITORY,
  USERS_REPOSITORY,
} from './constants';
import {
  School,
  SchoolDto,
  Sponsorship,
  SponsorshipDto,
  UserDto,
} from './users/user.entity';
import { UserInfo, UsersService } from './users/users.service';
// UserDto
import { v4 as uuidGenerator } from 'uuid';
import { zip } from 'rxjs';
import { userInfo } from 'os';
import { col, fn, Op, where } from 'sequelize';

@Injectable()
export class AppService {
  constructor(
    @Inject(SPONSORSHIPS_REPOSITORY)
    private sponsorshipsRepository: typeof Sponsorship,
    private usersService: UsersService,
    @Inject(SCHOOLS_REPOSITORY) private schoolsRepository: typeof School,
  ) {}
  getHello(): any {
    return {
      message: 'Hello World!',
    };
  }

  async getSponsorships(
    zip_name?: string,
    zip_code?: string,
    filter = '',
  ): Promise<Sponsorship[]> {
    const allSponsorships: Sponsorship[] = await this.sponsorshipsRepository.findAll<
      Sponsorship
    >();
    const foundSponsorships = await Promise.all(
      allSponsorships.map(async sponsorship => {
        const sponsorshipSchema: Sponsorship = await this.sponsorshipsRepository.findOne<
          Sponsorship
        >({ where: { sponsorship_id: sponsorship?.sponsorship_id } });

        const user = await sponsorshipSchema.$get('user');
        const school = await sponsorshipSchema.$get('school');

        // let sponsorGet = sponsorship
        sponsorship['dataValues']['sponsor_name'] =
          `${user?.dataValues?.first_name} ${user?.dataValues?.last_name}` ||
          user?.dataValues?.entity_name;
        sponsorship['dataValues']['school_name'] =
          school?.dataValues?.school_name;
        sponsorship['dataValues']['zip_code'] = school?.dataValues?.zip_code;
        sponsorship['dataValues']['description'] =
          user?.dataValues?.description;

        if (
          (zip_name &&
            zip_name.toLowerCase() !==
              school?.dataValues?.school_name?.toLowerCase()) ||
          (zip_code &&
            zip_code.toString().toLowerCase() !==
              school?.dataValues?.zip_code?.toLowerCase())
        ) {
          return;
        } else {
          console.log(
            zip_name,
            zip_code,
            school?.dataValues?.school_name,
            school?.dataValues?.zip_code,
          );
          return sponsorship;
        }
      }),
    );

    const sentResponse: Sponsorship[] = [];

    foundSponsorships.forEach(e => {
      if (e && e['dataValues'].school_name) sentResponse.push(e);
    });
    return sentResponse.sort(
      (a, b) => b['dataValues'].createdAt - a['dataValues'].createdAt,
    );
  }

  async getData(sponsorship: { form: any }, description: string): Promise<any> {
    const res = await Promise.all(
      (sponsorship.form?.schoolsArray as any[]).map(async school => {
        const { name, zip_code } = school;
        const schoolExists: School = await this.schoolsRepository.findOne({
          where: {
            zip_code,
            [Op.and]: [
              where(fn('lower', col('school_name')), fn('lower', name)),
            ],
          },
        });

        const businessType = [];
        const sponsors = [];

        let join = {};
        if (schoolExists) {
          const getSponsors: any = await this.getSponsorships(
            schoolExists.school_name,
          );
          if (getSponsors) {
            getSponsors.forEach(async sponsor => {
              console.log(sponsor);
              if (
                sponsor['dataValues'].description.toLowerCase() ===
                description.toLowerCase()
              ) {
                businessType.push(
                  sponsor['dataValues'].school_name +
                    ' is already sponsored by a business in ' +
                    sponsor['dataValues'].description,
                );
              }
              sponsors.push(sponsor);
            });
          }

          join = {
            message: businessType[0],
            sponsors: sponsors,
          };
        }

        return join;
      }),
    );

    return res;
  }

  async createSponsorship(
    sponsorship: {
      userInfo: UserInfo;
      form: any;
      values?: any[];
    },
    getDescription = '',
  ): Promise<any> {
    console.log('userInfo', sponsorship.userInfo);
    if (!sponsorship?.form) {
      throw new HttpException('Invalid form', HttpStatus.BAD_REQUEST);
    }

    sponsorship.userInfo.quantity = sponsorship.form.schoolsArray.length;
    const user = await this.usersService.registerUser(sponsorship.userInfo);
    console.log(user);

    const found = false;
    let lastDate = '';
    const res = await Promise.all(
      (sponsorship?.form?.schoolsArray as any[]).map(async school => {
        let school_id = uuidGenerator();
        const sponsorship_id = uuidGenerator();

        const { name, zip_code } = school;
        const schoolBody: SchoolDto = {
          zip_code: zip_code,
          school_name: name,
          school_id,
        };

        const schoolExists: School = await this.schoolsRepository.findOne({
          where: { zip_code, school_name: name },
        });

        if (schoolExists) {
          // return schoolExists;
          const getSponsors: any = await this.getSponsorships(
            schoolExists.school_name,
          );

          school_id = getSponsors[0]['dataValues'].school_id;
          lastDate = getSponsors[0]['dataValues'].expiry;
        }

        // return;
        if (!schoolExists) {
          const school: School = await this.schoolsRepository.create<School>(
            schoolBody,
          );
          school_id = school.school_id;
        }

        const day = lastDate ? new Date(lastDate) : new Date();
        const nextDay = lastDate ? new Date(lastDate) : new Date();
        nextDay.setDate(day.getDate() + 30);
        // const expieryDate = new Date().setDate(new Date().getDate() + 30);
        const sponsorshipBody: SponsorshipDto = {
          expiry: nextDay.toDateString(),
          quantity: '1',
          user_id: user.user.user_id,
          school_id,
          sponsorship_id,
        };

        // if (!sponsored) {
        const createdSponsorship = await this.sponsorshipsRepository.create<
          Sponsorship
        >(sponsorshipBody);

        return createdSponsorship;
        // }

        // return sponsored;
      }),
    );

    if (found) {
      const v = [];
      console.log(res, res.length);
      res.forEach(r => {
        const ob = r[0].dataValues.school_name;
        // const a[ob] = []
        r.forEach((e, i) => {
          const school = v.push(e.dataValues);
        });
      });
      return {
        result: v,
        message: 'School have reached maximum mount of sponsores',
      };
    }

    return res;
  }

  async getSchool(): Promise<School[]> {
    const allSchool: School[] = await this.schoolsRepository.findAll();

    return;
  }
}
