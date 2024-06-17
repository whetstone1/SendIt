import React, { useState, useEffect } from 'react';
import { Button, FlatList } from 'react-native';
import axios from 'axios';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Input = styled.TextInput`
  width: 100%;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const CampaignContainer = styled.View`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const DashboardScreen = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [tiltPoint, setTiltPoint] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/campaigns');
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/campaigns', {
        title,
        description,
        goalAmount,
        tiltPoint,
      });
      setCampaigns([...campaigns, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Text>Create a New Campaign</Text>
      <Input
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <Input
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Input
        placeholder="Goal Amount"
        value={goalAmount}
        onChangeText={setGoalAmount}
      />
      <Input
        placeholder="Tilt Point"
        value={tiltPoint}
        onChangeText={setTiltPoint}
      />
      <Button title="Create Campaign" onPress={handleCreateCampaign} />
      <FlatList
        data={campaigns}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CampaignContainer>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Goal: ${item.goalAmount}</Text>
            <Text>Raised: ${item.amountRaised}</Text>
            <Button
              title="Contribute"
              onPress={() => navigation.navigate('Contribute', { campaignId: item._id })}
            />
          </CampaignContainer>
        )}
      />
    </Container>
  );
};

export default DashboardScreen;
