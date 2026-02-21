# Data Model: GiftForge Legacy Gifting

## Entities

### User
| Field | Type | Description |
|---|---|---|
| id | UUID (PK) | Unique identifier |
| name | String | Full name |
| role | Enum | grandparent, grandchild, trustee |

### Grandchild
| Field | Type | Description |
|---|---|---|
| id | UUID (PK) | Internal ID |
| linked_grandparent_id | UUID (FK) | Reference to User (grandparent) |

### Gift
| Field | Type | Description |
|---|---|---|
| id | UUID (PK) | Unique identifier |
| grandparent_id | UUID (FK) | Creator |
| grandchild_id | UUID (FK) | Beneficiary |
| corpus | Decimal | Principal amount |
| currency | Enum | USD, INR |
| status | Enum | Draft, Active, Under Review, Approved, Rejected, Redirected, Completed |
| risk_profile | Enum | Conservative, Balanced, Growth |
| rule_type | Enum | Time, Milestone, Behavior |
| fallback_ngo_id | String | Selected NGO ID from mock list |

### Milestone
| Field | Type | Description |
|---|---|---|
| id | UUID (PK) | Unique identifier |
| gift_id | UUID (FK) | Parent gift |
| type | String | Graduation, Marriage, etc. |
| percentage | Integer | % of gift corpus to release |
| status | Enum | Pending, Submitted, Approved, Rejected |

### Notification
| Field | Type | Description |
|---|---|---|
| id | UUID (PK) | Unique identifier |
| recipient_id | UUID (FK) | User who receives |
| role | Enum | Recipient role context |
| event_type | String | e.g., MILESTONE_APPROVED |
| message | Text | Human readable text |
| is_read | Boolean | Read status |
| action_url | String | Deep link to UI page |
| created_at | DateTime | ISO timestamp |

### MediaMessage
| Field | Type | Description |
|---|---|---|
| id | UUID (PK) | Unique identifier |
| gift_id | UUID (FK) | Associated gift |
| uploader_id | UUID (FK) | User who uploaded |
| type | Enum | text, photo, audio, video |
| file_path | String | Storage path |
| created_at | DateTime | ISO timestamp |

### OverrideWindow
| Field | Type | Description |
|---|---|---|
| id | UUID (PK) | Unique identifier |
| gift_id | UUID (FK) | Linked gift |
| created_at | DateTime | Time rejection occurred |
| expires_at | DateTime | created_at + 7 days |
| status | Enum | Open, Overridden, Expired |

## Relationships
- A **Grandparent** can have multiple **Gifts** and multiple **Grandchildren**.
- A **Gift** belongs to one **Grandparent** and one **Grandchild**.
- A **Gift** can have many **Milestones**.
- A **Gift** can have many **MediaMessages**.
- A **Gift** has one **OverrideWindow** if rejected.
