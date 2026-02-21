from typing import Dict, List, Set, Tuple
from app.shared.gifts.schemas import GiftStatus

class StateMachineError(Exception):
    pass

class GiftStateMachine:
    # Define valid transitions: source -> {targets}
    _VALID_TRANSITIONS: Dict[GiftStatus, Set[GiftStatus]] = {
        GiftStatus.Draft: {GiftStatus.Active},
        GiftStatus.Active: {GiftStatus.Under_Review, GiftStatus.Completed},
        GiftStatus.Under_Review: {GiftStatus.Approved, GiftStatus.Rejected},
        GiftStatus.Approved: {GiftStatus.Active, GiftStatus.Completed},
        GiftStatus.Rejected: {GiftStatus.Active, GiftStatus.Redirected},
        GiftStatus.Redirected: set(), # Terminal state for redirected funds
        GiftStatus.Completed: set()    # Terminal state
    }

    @classmethod
    def validate_transition(cls, current_status: GiftStatus, next_status: GiftStatus):
        """
        Validates if a gift can transition from current_status to next_status.
        Raises StateMachineError if transition is invalid.
        """
        valid_targets = cls._VALID_TRANSITIONS.get(current_status, set())
        if next_status not in valid_targets:
            raise StateMachineError(
                f"Invalid transition from {current_status} to {next_status}. "
                f"Valid targets: {', '.join(valid_targets) if valid_targets else 'None'}"
            )
        return True

    @classmethod
    def get_allowed_transitions(cls, current_status: GiftStatus) -> List[GiftStatus]:
        return list(cls._VALID_TRANSITIONS.get(current_status, set()))
