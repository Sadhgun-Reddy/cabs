import { useState, useEffect } from "react";
import axios from "axios";
import CommonFooter from "../../components/footer/commonFooter";
import { URLS } from "../../url";
import { user49 } from "../../utils/imagepath"; // ✅ named import

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper to split full name into first/last
  const splitName = (fullName) => {
    if (!fullName) return { firstName: "", lastName: "" };
    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    return { firstName, lastName };
  };

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        URLS.GetProfile, // should point to "/v1/gkcabs/admin/auth/getprofile"
        {}, // no body needed
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.success && response.data?.profile) {
        const profile = response.data.profile;
        const { firstName, lastName } = splitName(profile.name);

        setFormData({
          firstName,
          lastName,
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
        });

        // Construct full image URL if image exists
        if (profile.image) {
          const imagePath = profile.image.replace(/\\/g, "/");
          setProfileImage(`http://88.222.213.67:5090/${imagePath}`);
        } else {
          setProfileImage(user49); // fallback
        }
      } else {
        throw new Error(response.data?.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message || "An error occurred while fetching profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Profile</h4>
            <h6>User Profile</h6>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Profile</h4>
          </div>

          <div className="card-body profile-body">
            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {!loading && !error && (
              <form>
                <div className="profile-pic-upload mb-4">
                  <img
                    src={profileImage || user49}
                    alt="user"
                    width="100"
                    className="rounded"
                    onError={(e) => {
                      e.target.src = user49;
                    }}
                  />
                </div>

                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-lg-12 mb-3">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
};

export default Profile;