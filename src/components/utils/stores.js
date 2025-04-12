import { create } from 'zustand';

export const useSelectionStore = create((set, get) => ({
    selection: null,
    color: '#3388ff', // Default leaflet GeoJSON color
    groups: {}, // Object to store groups of GeoJSONs
    activeGroupId: null, // Currently active group
    
    setSelection: (nextSelection) => set({ selection: nextSelection }),
    clearSelection: () => set({ selection: null }),
    setColor: (newColor) => set({ color: newColor }),
    
    // Group management
    createGroup: (groupName) => {
        const groupId = Date.now().toString();
        set((state) => ({
            groups: {
                ...state.groups,
                [groupId]: {
                    id: groupId,
                    name: groupName,
                    features: [],
                    color: '#ff8833' // Default color for the group
                }
            },
            activeGroupId: groupId
        }));
        return groupId;
    },
    
    setActiveGroup: (groupId) => set({ activeGroupId: groupId }),
    
    setGroupColor: (groupId, color) => set((state) => ({
        groups: {
            ...state.groups,
            [groupId]: {
                ...state.groups[groupId],
                color
            }
        }
    })),
    
    deleteGroup: (groupId) => set((state) => {
        const { [groupId]: _, ...remainingGroups } = state.groups;
        return {
            groups: remainingGroups,
            activeGroupId: state.activeGroupId === groupId ? null : state.activeGroupId
        };
    }),
    
    addSelectionToGroup: (groupId) => {
        const { selection, groups } = get();
        if (!selection || !groups[groupId]) return;
        
        // Add the current selection to the group
        set((state) => ({
            groups: {
                ...state.groups,
                [groupId]: {
                    ...state.groups[groupId],
                    features: [...state.groups[groupId].features, selection.features[0]]
                }
            }
        }));
    },
    
    removeFeatureFromGroup: (groupId, featureIndex) => set((state) => ({
        groups: {
            ...state.groups,
            [groupId]: {
                ...state.groups[groupId],
                features: state.groups[groupId].features.filter((_, idx) => idx !== featureIndex)
            }
        }
    })),
    
    // Helper to get a multipolygon GeoJSON from a group
    getGroupAsGeoJSON: (groupId) => {
        const { groups } = get();
        if (!groups[groupId] || groups[groupId].features.length === 0) return null;
        
        return {
            type: "FeatureCollection",
            features: groups[groupId].features
        };
    }
}));