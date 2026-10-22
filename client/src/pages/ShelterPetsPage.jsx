import React, { useState, useEffect } from 'react';
import { Plus, Edit, RefreshCw, PawPrint, CheckCircle2 } from 'lucide-react';
import petsApi from '../api/petsApi';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import AlertBanner from '../components/AlertBanner';
import LoadingSpinner from '../components/LoadingSpinner';

export function ShelterPetsPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Pet Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState(2);
  const [gender, setGender] = useState('Male');
  const [size, setSize] = useState('Medium');
  const [location, setLocation] = useState('Bhavan Shelter, Andheri West');
  const [medicalNeeds, setMedicalNeeds] = useState('None, healthy');
  const [vaccinationStatus, setVaccinationStatus] = useState('Fully Vaccinated');
  const [description, setDescription] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadPets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await petsApi.listPets();
      setPets(res.pets || []);
    } catch (err) {
      setError(err.message || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const handleAddPetSubmit = async (e) => {
    e.preventDefault();
    if (!name || !species || !breed) {
      setError('Name, species, and breed are required');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await petsApi.addPet({
        name: name.trim(),
        species,
        breed: breed.trim(),
        age: Number(age),
        gender,
        size,
        location: location.trim(),
        medicalNeeds: medicalNeeds.trim(),
        vaccinationStatus,
        adoptionStatus: 'Available',
        description: description.trim(),
        photoURL: photoURL.trim() || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
        addedBy: user?.userId
      });

      setSuccessMsg(res.message || 'Pet successfully added to shelter inventory!');
      loadPets();
      setTimeout(() => {
        setAddModalOpen(false);
        setSuccessMsg('');
        setName('');
        setBreed('');
        setDescription('');
        setPhotoURL('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to add pet');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (petId, newStatus) => {
    try {
      await petsApi.updateStatus(petId, newStatus);
      loadPets();
    } catch (err) {
      alert(err.message || 'Failed to update pet status');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase' }}>
            Inventory Management
          </span>
          <h1 style={{ fontSize: '2.2rem', margin: '0.2rem 0' }}>
            Shelter Animals ({pets.length})
          </h1>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.95rem' }}>
            Add, update health info, and track the adoption status of all resident shelter pets.
          </p>
        </div>

        <Button
          variant="sage"
          size="lg"
          icon={Plus}
          onClick={() => {
            setSuccessMsg('');
            setAddModalOpen(true);
          }}
        >
          Add New Pet to Shelter
        </Button>
      </div>

      {error && <AlertBanner type="error" message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner text="Loading inventory records..." />
      ) : (
        <GlassCard padding="1.5rem" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(73, 107, 82, 0.15)', color: 'var(--color-charcoal-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Pet</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Species / Breed</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Age / Gender</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Location</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr
                    key={pet.petId}
                    style={{
                      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                      transition: 'background-color 0.15s'
                    }}
                  >
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={pet.photoURL || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80'}
                        alt={pet.name}
                        style={{ width: 44, height: 44, borderRadius: '8px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                      <div>
                        <strong style={{ fontSize: '1rem' }}>{pet.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>ID #{pet.petId}</div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div>{pet.species}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>{pet.breed}</div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div>{pet.age} {pet.age === 1 ? 'yr' : 'yrs'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>{pet.gender} • {pet.size}</div>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                      {pet.location}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <Badge variant={pet.adoptionStatus}>{pet.adoptionStatus}</Badge>
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <select
                        value={pet.adoptionStatus}
                        onChange={(e) => handleStatusChange(pet.petId, e.target.value)}
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(73, 107, 82, 0.25)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Available">Set Available</option>
                        <option value="Pending">Set Pending</option>
                        <option value="Adopted">Set Adopted</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Add New Pet Modal (ShelterWorker.addpet() in UML) */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Pet to Shelter (ShelterWorker.addpet)"
        maxWidth="680px"
      >
        {successMsg ? (
          <AlertBanner type="success" message={successMsg} />
        ) : (
          <form onSubmit={handleAddPetSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Pet Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bella"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(73, 107, 82, 0.3)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Species *
                </label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(73, 107, 82, 0.3)',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Breed *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Golden Retriever"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(73, 107, 82, 0.3)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Age (years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(73, 107, 82, 0.3)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(73, 107, 82, 0.3)',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(73, 107, 82, 0.3)',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Location / Branch
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(73, 107, 82, 0.3)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Photo URL (Web reference)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Description & Personality
              </label>
              <textarea
                rows={2}
                placeholder="Gentle, energetic, loves children, fully leash trained..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(73, 107, 82, 0.3)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="glass" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="sage" type="submit" loading={submitting} icon={Plus}>
                Add to Inventory
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default ShelterPetsPage;
