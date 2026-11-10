import type { Profile } from "../api";
import "./ProfileCard.scss";

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <section className="profile-card" aria-labelledby="profile-card-heading">
      <h2 className="profile-card__heading" id="profile-card-heading">Profile</h2>
      <dl className="profile-card__details">
        <div className="profile-card__field">
          <dt className="profile-card__label">Name</dt>
          <dd className="profile-card__value">{profile.name}</dd>
        </div>
        <div className="profile-card__field">
          <dt className="profile-card__label">Role</dt>
          <dd className="profile-card__value">{profile.role}</dd>
        </div>
        <div className="profile-card__field">
          <dt className="profile-card__label">Age</dt>
          <dd className="profile-card__value">{profile.age}</dd>
        </div>
      </dl>
    </section>
  );
}
