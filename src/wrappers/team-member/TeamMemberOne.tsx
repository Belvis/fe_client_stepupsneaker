import clsx from "clsx";
import SectionTitleTwo from "../../components/section-title/SectionTitleTwo";
import teamMemberData from "../../data/team-members/team-member-one.json";
import TeamMemberOneSingle from "../../components/team-member/TeamMemberOneSingle";

type TeamMemberOneProps = {
  spaceBottomClass: string;
  spaceTopClass: string;
};

const TeamMemberOne: React.FC<TeamMemberOneProps> = ({
  spaceTopClass,
  spaceBottomClass,
}) => {
  return (
    <div className={clsx("team-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        {/* section title */}
        <SectionTitleTwo
          titleText="Thành viên của nhóm"
          subTitleText="Các chuyên gia tài năng."
          positionClass="text-center"
          spaceClass="mb-60"
        />

        <div className="row">
          {teamMemberData?.map((single, key) => (
            <div className="col-lg-3 col-md-6 col-sm-6" key={key}>
              <TeamMemberOneSingle data={single} spaceBottomClass="mb-30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberOne;
