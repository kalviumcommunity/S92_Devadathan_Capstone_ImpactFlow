import { useState } from "react";

function BeneficiaryCard() {
const [beneficiary, setBeneficiary] = useState({
  _id: "6ab0c4d5a40d2ca370d82524",
  name: "Rahul",
  age: 20,
  location: "Chennai",
  program: "Education Support",
});

const [editing, setEditing] = useState(false);
  
return (
    <div>
      <h2>Beneficiary Details</h2>

      {beneficiary ? (
  <div>
    <p>Name: {beneficiary.name}</p>
    <p>Age: {beneficiary.age}</p>
    <p>Location: {beneficiary.location}</p>
    <p>Program: {beneficiary.program}</p>
  </div>
) : (
  <p>Beneficiary deleted.</p>
)}

      {editing && (
  <div>
    <input
      value={beneficiary.name}
      onChange={(e) =>
        setBeneficiary({ ...beneficiary, name: e.target.value })
      }
    />

    <input
      value={beneficiary.age}
      onChange={(e) =>
        setBeneficiary({ ...beneficiary, age: e.target.value })
      }
    />

    <input
      value={beneficiary.location}
      onChange={(e) =>
        setBeneficiary({ ...beneficiary, location: e.target.value })
      }
    />

    <input
      value={beneficiary.program}
      onChange={(e) =>
        setBeneficiary({ ...beneficiary, program: e.target.value })
      }
    />

    <button
  onClick={async () => {
    const response = await fetch(
      `http://localhost:5000/api/beneficiaries/${beneficiary._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: beneficiary.name,
          age: beneficiary.age,
          location: beneficiary.location,
          program: beneficiary.program,
        }),
      }
    );

    const updatedBeneficiary = await response.json();

    setBeneficiary(updatedBeneficiary);
    setEditing(false);
  }}
>
  Save
</button>
  </div>
)}

      <button onClick={() => setEditing(true)}>Edit</button>
      <button
  onClick={async () => {
    await fetch(`http://localhost:5000/api/beneficiaries/${beneficiary._id}`, {
      method: "DELETE",
    });

    setBeneficiary(null);
  }}
>
  Delete
</button>
    </div>
  );
}

export default BeneficiaryCard;