import { participantColors } from './participantColors';

const baseParticipants = [
  { id: 'p1', name: 'Julie', initial: 'J' },
  { id: 'p2', name: 'Zoé', initial: 'Z' },
  { id: 'p3', name: 'Jana', initial: 'J' },
  { id: 'p4', name: 'Xavier', initial: 'X' },
  { id: 'p5', name: 'Jordi', initial: 'J' },
  { id: 'p6', name: 'Martí', initial: 'M' },
];

const participants = baseParticipants.map((participant, index) => ({
  ...participant,
  color: participantColors[index % participantColors.length],
}));

export const mockGroup = {
  id: 'group-1',
  name: 'Viatge Mallorca',
  participants,
};
