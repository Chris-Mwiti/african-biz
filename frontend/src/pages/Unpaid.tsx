import React from 'react';

export const Unpaid: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f8f8f8',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '20px',
        borderBottom: '2px solid #ccc',
        paddingBottom: '10px'
      }}>
        Service Interruption
      </h1>
      <p style={{
        fontSize: '1.2rem',
        color: '#666',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        Access to this component is temporarily suspended pending the settlement of outstanding payments. 
        We have fulfilled our obligations in delivering the agreed-upon services and require the same level of commitment in return.
      </p>
      <p style={{
        fontSize: '1.2rem',
        color: '#666',
        maxWidth: '600px',
        lineHeight: '1.6',
        marginTop: '20px'
      }}>
        Please be advised that this matter requires your immediate attention to restore full functionality.
        We value our partnership and trust that we can resolve this amicably.
      </p>
      <div style={{
        marginTop: '40px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          color: '#333',
          marginBottom: '10px'
        }}>
          Next Steps
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#555'
        }}>
          To resolve this issue, please contact our billing department at your earliest convenience to finalize the payment process.
        </p>
      </div>
    </div>
  );
};

export default Unpaid;
