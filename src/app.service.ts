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
} from './users/user.entity';
import { UserInfo } from './users/users.service';
import { v4 as uuidGenerator } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    @Inject(SPONSORSHIPS_REPOSITORY)
    private sponsorshipsRepository: typeof Sponsorship,
    @Inject(SCHOOLS_REPOSITORY) private schoolsRepository: typeof School,
  ) {}
  getHello(): any {
    return {
      message: 'Hello World!',
    };
  }

  async getSponsorships(zip_name?: string): Promise<Sponsorship[]> {
    let allSponsorships: Sponsorship[] = await this.sponsorshipsRepository.findAll<
      Sponsorship
    >();
    let foundSponsorships = await Promise.all(
      allSponsorships.map(async sponsorship => {
        let sponsorshipSchema: Sponsorship = await this.sponsorshipsRepository.findOne<
          Sponsorship
        >({ where: { sponsorship_id: sponsorship?.sponsorship_id } });
        let user = await sponsorshipSchema.$get('user');
        let school = await sponsorshipSchema.$get('school');
        sponsorship['dataValues']['sponsor_name'] =
          `${user?.dataValues?.first_name} ${user?.dataValues?.last_name}` ||
          user?.dataValues?.entity_name;
        sponsorship['dataValues']['school_name'] =
          school?.dataValues?.school_name;

        if (
          zip_name &&
          !zip_name.includes(school?.dataValues?.school_name) &&
          !zip_name.includes(school?.dataValues?.zip_code)
        ) {
          return null;
        }

        return sponsorship;
      }),
    );

    return foundSponsorships.filter(sponsorship => sponsorship);
  }

  async createSponsorship(sponsorship: {
    userInfo: UserInfo;
    form: any;
  }): Promise<SponsorshipDto[]> {
    console.log('userInfo', sponsorship.userInfo);
    if (!sponsorship?.form) {
      throw new HttpException('Invalid form', HttpStatus.BAD_REQUEST);
    }

    return await Promise.all(
      (sponsorship?.form?.schoolsArray as any[]).map(async school => {
        let school_id = uuidGenerator();
        const sponsorship_id = uuidGenerator();

        const { name, zip_code } = school;
        const schoolBody: SchoolDto = {
          zip_code: sponsorship?.form[zip_code],
          school_name: sponsorship?.form[name],
          school_id,
        };

        const schoolExists: School = await this.schoolsRepository.findOne({
          where: { zip_code, school_name: name },
        });
        if (!schoolExists) {
          const school: School = await this.schoolsRepository.create<School>(
            schoolBody,
          );
          school_id = school.school_id;
        }

        const sponsorshipBody: SponsorshipDto = {
          expiry: `${new Date().setDate(new Date().getDate() + 30)}`,
          quantity: '1',
          user_id: sponsorship.userInfo?.user?.user_id,
          school_id,
          sponsorship_id,
        };
        const createdSponsorship = await this.sponsorshipsRepository.create<
          Sponsorship
        >(sponsorshipBody);

        return createdSponsorship;
      }),
    );
  }
}
