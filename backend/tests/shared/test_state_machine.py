import pytest
from app.shared.gifts.state_machine import GiftStateMachine, StateMachineError
from app.shared.gifts.schemas import GiftStatus

def test_valid_transitions():
    assert GiftStateMachine.validate_transition(GiftStatus.Draft, GiftStatus.Active)
    assert GiftStateMachine.validate_transition(GiftStatus.Active, GiftStatus.Under_Review)
    assert GiftStateMachine.validate_transition(GiftStatus.Under_Review, GiftStatus.Approved)
    assert GiftStateMachine.validate_transition(GiftStatus.Under_Review, GiftStatus.Rejected)
    assert GiftStateMachine.validate_transition(GiftStatus.Approved, GiftStatus.Active)
    assert GiftStateMachine.validate_transition(GiftStatus.Rejected, GiftStatus.Active)
    assert GiftStateMachine.validate_transition(GiftStatus.Rejected, GiftStatus.Redirected)

def test_invalid_transitions():
    with pytest.raises(StateMachineError):
        GiftStateMachine.validate_transition(GiftStatus.Draft, GiftStatus.Approved)
    
    with pytest.raises(StateMachineError):
        GiftStateMachine.validate_transition(GiftStatus.Completed, GiftStatus.Active)
        
    with pytest.raises(StateMachineError):
        # State machine doesn't allow self-transitions unless explicitly added
        GiftStateMachine.validate_transition(GiftStatus.Active, GiftStatus.Active)

def test_terminal_states():
    assert GiftStateMachine.get_allowed_transitions(GiftStatus.Completed) == []
    assert GiftStateMachine.get_allowed_transitions(GiftStatus.Redirected) == []

def test_get_allowed():
    allowed = GiftStateMachine.get_allowed_transitions(GiftStatus.Under_Review)
    assert set(allowed) == {GiftStatus.Approved, GiftStatus.Rejected}
